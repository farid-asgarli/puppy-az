using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Common.Repository.Filtering;

public class PaginationSpecification
{
    [Range(0, 100)]
    private int? _number;

    [property: DefaultValue(1)]
    public int? Number
    {
        get => _number;
        init
        {
            if (value.HasValue && value.Value < 1)
                _number = 1;
            else
                _number = value;
        }
    }

    [Range(1, int.MaxValue)]
    private int? _size;

    [property: DefaultValue(10)]
    public int? Size
    {
        get => _size;
        init
        {
            if (value.HasValue && value.Value < 1)
                _size = 1;
            else
                _size = value;
        }
    }
}
